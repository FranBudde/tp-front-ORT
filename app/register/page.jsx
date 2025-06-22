"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
  });

  const [error, setError] = useState("");

  const validateForm = () => {
    const { firstName, lastName, userName, password } = formData;

    if (!firstName || !lastName || !userName || !password) {
      setError("Todos los campos son obligatorios.");
      return false;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(firstName)) {
      setError("El nombre solo puede contener letras.");
      return false;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastName)) {
      setError("El apellido solo puede contener letras.");
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(userName)) {
      setError(
        "El nombre de usuario sólo puede contener letras, números y guiones bajos."
      );
      return false;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/insert_user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        if (response.status === 409) {
          setError("El nombre de usuario ya está registrado.");
        } else {
          setError("Error al registrarse.");
        }
        return;
      }

      alert("Tu usuario fue creado exitosamente, por favor, inicia sesión.");
      router.push("/login");
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-gray-900 text-white flex justify-center items-center">
      <div className="w-full max-w-md mx-auto bg-gray-800/80 rounded-3xl p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold mb-6 text-white">
          Registrarse
        </h2>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Nombre"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Apellido"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              id="userName"
              name="userName"
              type="text"
              placeholder="Nombre de usuario"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Contraseña"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition-colors"
          >
            Registrarse
          </button>
        </form>

        <p className="text-sm text-center text-gray-300 mt-6">
          ¿Ya tenés una cuenta?{" "}
          <a
            href="/login"
            className="text-yellow-400 hover:text-yellow-300 font-medium"
          >
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}
