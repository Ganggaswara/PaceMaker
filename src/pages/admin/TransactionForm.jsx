import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTransactions } from "../../utils/TransactionContext";
import { useProducts } from "../../utils/ProductContext";

export default function TransactionForm() {
	const navigate = useNavigate();
	const { addTransaction, members, membersLoading, membersError } = useTransactions();
	const { products, isLoading: productsLoading, isError: productsError } = useProducts();

	const [formData, setFormData] = useState({
		member_id: "",
		payment_method: "cash",
		notes: "",
		transaction_date: new Date().toISOString().split('T')[0],
		items: [
			{ product_id: "", quantity: 1 }
		]
	});

	const [errors, setErrors] = useState({});

	const productOptions = useMemo(() => Array.isArray(products) ? products : [], [products]);
	const memberOptions = useMemo(() => Array.isArray(members) ? members : [], [members]);

	useEffect(() => {
		if (membersError) toast.error("Gagal memuat member.");
		if (productsError) toast.error("Gagal memuat produk.");
	}, [membersError, productsError]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleItemChange = (index, field, value) => {
		setFormData(prev => {
			const next = { ...prev };
			next.items = prev.items.map((it, i) => i === index ? { ...it, [field]: field === 'quantity' ? Number(value || 0) : value } : it);
			return next;
		});
	};

	const addItemRow = () => {
		setFormData(prev => ({ ...prev, items: [...prev.items, { product_id: "", quantity: 1 }] }));
	};

	const removeItemRow = (index) => {
		setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
	};

	const validate = () => {
		const v = {};
		if (!formData.member_id) v.member_id = ["Member wajib dipilih"];
		if (!formData.payment_method) v.payment_method = ["Metode pembayaran wajib dipilih"];

		const itemErrors = formData.items.map((it) => {
			const e = {};
			if (!it.product_id) e.product_id = "Produk wajib dipilih";
			if (!it.quantity || it.quantity < 1) e.quantity = "Qty minimal 1";
			return e;
		});
		if (itemErrors.some(e => Object.keys(e).length > 0)) v.items = itemErrors;
		return v;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});
		const v = validate();
		if (Object.keys(v).length > 0) {
			setErrors(v);
			toast.error("⚠ Periksa kembali data yang dimasukkan.");
			return;
		}

		const payload = {
			member_id: Number(formData.member_id),
			products: formData.items
				.filter(it => it.product_id && it.quantity > 0)
				.map(it => ({ id: Number(it.product_id), quantity: Number(it.quantity) })),
			payment_method: String(formData.payment_method),
			notes: formData.notes ? String(formData.notes) : undefined,
			transaction_date: formData.transaction_date,
		};

		try {
			await addTransaction(payload);
			toast.success("Transaksi berhasil dibuat!");
			navigate("/admin/transactions");
		} catch (error) {
			if (error.response?.status === 422) {
				setErrors(error.response.data.errors || {});
				toast.error("Validasi gagal. Mohon periksa input.");
			} else {
				toast.error("❌ Gagal membuat transaksi.");
			}
		}
	};

	if (membersLoading || productsLoading) {
		return (
			<div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6 flex items-center justify-center min-h-80">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
					<p className="text-gray-600">Memuat data...</p>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6 space-y-6">
			<h2 className="text-xl font-semibold text-gray-700 mb-2 border-b pb-2">Tambah Transaksi</h2>

			{/* Member */}
			<div className="flex flex-col">
				<label className="text-sm font-medium text-gray-600 mb-1">Member</label>
				<select
					name="member_id"
					value={formData.member_id}
					onChange={handleChange}
					className={`border rounded-md p-2 w-full ${errors.member_id ? "border-red-500" : ""}`}
				>
					<option value="">Pilih Member</option>
					{memberOptions.map(m => (
						<option key={m.id} value={m.id}>{m.name}</option>
					))}
				</select>
				{errors.member_id && <p className="text-red-500 text-sm mt-1">{errors.member_id[0]}</p>}
			</div>

		{/* Tanggal Transaksi */}
		<div className="flex flex-col">
			<label className="text-sm font-medium text-gray-600 mb-1">Tanggal Transaksi</label>
			<input
				type="date"
				name="transaction_date"
				value={formData.transaction_date}
				onChange={handleChange}
				className="border rounded-md p-2 w-full"
			/>
		</div>

			{/* Items */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<label className="text-sm font-medium text-gray-600">Produk</label>
					<button type="button" onClick={addItemRow} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md">Tambah Baris</button>
				</div>
				{formData.items.map((item, idx) => {
					const itemErr = Array.isArray(errors.items) ? errors.items[idx] : undefined;
					return (
						<div key={idx} className="grid grid-cols-12 gap-3 items-end">
							<div className="col-span-7">
								<label className="text-xs text-gray-600">Produk</label>
								<select
									value={item.product_id}
									onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
									className={`border rounded-md p-2 w-full ${itemErr?.product_id ? 'border-red-500' : ''}`}
								>
									<option value="">Pilih Produk</option>
									{productOptions.map(p => (
										<option key={p.product_id ?? p.id} value={(p.product_id ?? p.id)}>
											{p.name}
										</option>
									))}
								</select>
								{itemErr?.product_id && <p className="text-red-500 text-xs mt-1">{itemErr.product_id}</p>}
							</div>
							<div className="col-span-3">
								<label className="text-xs text-gray-600">Qty</label>
								<input
									type="number"
									min="1"
									value={item.quantity}
									onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
									className={`border rounded-md p-2 w-full ${itemErr?.quantity ? 'border-red-500' : ''}`}
								/>
								{itemErr?.quantity && <p className="text-red-500 text-xs mt-1">{itemErr.quantity}</p>}
							</div>
							<div className="col-span-2 flex justify-end">
								<button type="button" onClick={() => removeItemRow(idx)} className="px-3 py-2 text-sm bg-red-500 text-white rounded-md">Hapus</button>
							</div>
						</div>
					);
				})}
			</div>

			{/* Payment method */}
			<div className="flex flex-col">
				<label className="text-sm font-medium text-gray-600 mb-1">Metode Pembayaran</label>
				<select
					name="payment_method"
					value={formData.payment_method}
					onChange={handleChange}
					className={`border rounded-md p-2 w-full ${errors.payment_method ? "border-red-500" : ""}`}
				>
					<option value="cash">Tunai</option>
					<option value="card">Kartu</option>
					<option value="transfer">Transfer</option>
					<option value="e-wallet">E-Wallet</option>
				</select>
				{errors.payment_method && <p className="text-red-500 text-sm mt-1">{errors.payment_method[0]}</p>}
			</div>

			{/* Notes */}
			<div className="flex flex-col">
				<label className="text-sm font-medium text-gray-600 mb-1">Catatan</label>
				<textarea
					name="notes"
					value={formData.notes}
					onChange={handleChange}
					rows="3"
					placeholder="Catatan tambahan (opsional)"
					className="border rounded-md p-2 w-full"
				/>
			</div>

			<div className="flex gap-3 justify-end">
				<button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-md border">Batal</button>
				<button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white">Simpan Transaksi</button>
			</div>
		</form>
	);
}
