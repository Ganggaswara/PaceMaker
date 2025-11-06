import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTransactions } from "../../utils/TransactionContext";

export default function MemberForm() {
	const navigate = useNavigate();
	const { addMember } = useTransactions();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
		membership_type: "basic",
		status: "active",
		membership_date: "",
		birth_date: "",
	});
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const validate = () => {
		const v = {};
		if (!formData.name.trim()) v.name = ["Nama wajib diisi"];
		if (!formData.email.trim()) v.email = ["Email wajib diisi"];
		// Optional: basic email check
		if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) v.email = ["Format email tidak valid"];
		if (!formData.membership_type) v.membership_type = ["Tipe member wajib dipilih"];
		if (!formData.status) v.status = ["Status wajib dipilih"];
		if (!formData.membership_date) v.membership_date = ["Tanggal bergabung wajib diisi"];
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
			name: formData.name.trim(),
			email: formData.email.trim(),
			phone: formData.phone ? String(formData.phone) : undefined,
			address: formData.address ? String(formData.address) : undefined,
			membership_type: formData.membership_type,
			status: formData.status,
			membership_date: formData.membership_date,
			birth_date: formData.birth_date || undefined,
		};

		try {
			await addMember(payload);
			toast.success("Member berhasil ditambahkan!");
			navigate("/admin/members");
		} catch (error) {
			if (error.response?.status === 422) {
				setErrors(error.response.data.errors || {});
				toast.error("Validasi gagal. Mohon periksa input.");
			} else {
				toast.error("❌ Gagal menambahkan member.");
			}
		}
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6 space-y-5">
			<h2 className="text-xl font-semibold text-gray-700 mb-2 border-b pb-2">Tambah Member</h2>

			<div className="flex flex-col">
				<label className="text-sm font-medium text-gray-600 mb-1">Nama</label>
				<input
					name="name"
					value={formData.name}
					onChange={handleChange}
					placeholder="Nama lengkap"
					className={`border rounded-md p-2 w-full ${errors.name ? "border-red-500" : ""}`}
				/>
				{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
			</div>

			<div className="flex flex-col">
				<label className="text-sm font-medium text-gray-600 mb-1">Email</label>
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					placeholder="email@domain.com"
					className={`border rounded-md p-2 w-full ${errors.email ? "border-red-500" : ""}`}
				/>
				{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="flex flex-col">
					<label className="text-sm font-medium text-gray-600 mb-1">Telepon</label>
					<input
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						placeholder="08xxxxxxxxxx"
						className="border rounded-md p-2 w-full"
					/>
				</div>
				<div className="flex flex-col">
					<label className="text-sm font-medium text-gray-600 mb-1">Tanggal Lahir</label>
					<input
						type="date"
						name="birth_date"
						value={formData.birth_date}
						onChange={handleChange}
						className="border rounded-md p-2 w-full"
					/>
				</div>
			</div>

			<div className="flex flex-col">
				<label className="text-sm font-medium text-gray-600 mb-1">Alamat</label>
				<textarea
					name="address"
					value={formData.address}
					onChange={handleChange}
					rows="3"
					placeholder="Alamat lengkap (opsional)"
					className="border rounded-md p-2 w-full"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="flex flex-col">
					<label className="text-sm font-medium text-gray-600 mb-1">Tipe Member</label>
					<select
						name="membership_type"
						value={formData.membership_type}
						onChange={handleChange}
						className={`border rounded-md p-2 w-full ${errors.membership_type ? "border-red-500" : ""}`}
					>
						<option value="basic">Basic</option>
						<option value="premium">Premium</option>
						<option value="vip">VIP</option>
					</select>
					{errors.membership_type && <p className="text-red-500 text-sm mt-1">{errors.membership_type[0]}</p>}
				</div>
				<div className="flex flex-col">
					<label className="text-sm font-medium text-gray-600 mb-1">Status</label>
					<select
						name="status"
						value={formData.status}
						onChange={handleChange}
						className={`border rounded-md p-2 w-full ${errors.status ? "border-red-500" : ""}`}
					>
						<option value="active">Aktif</option>
						<option value="inactive">Tidak Aktif</option>
						<option value="suspended">Ditangguhkan</option>
					</select>
					{errors.status && <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>}
				</div>
				<div className="flex flex-col">
					<label className="text-sm font-medium text-gray-600 mb-1">Tanggal Bergabung</label>
					<input
						type="date"
						name="membership_date"
						value={formData.membership_date}
						onChange={handleChange}
						className={`border rounded-md p-2 w-full ${errors.membership_date ? "border-red-500" : ""}`}
					/>
					{errors.membership_date && <p className="text-red-500 text-sm mt-1">{errors.membership_date[0]}</p>}
				</div>
			</div>

			<div className="flex gap-3 justify-end">
				<button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-md border">Batal</button>
				<button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white">Simpan</button>
			</div>
		</form>
	);
}
