"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        try {
          const decodedToken = jwtDecode(data.token);
          const userIdFromToken = decodedToken.userId;
          router.push(`/${userIdFromToken}/home`);
        } catch (decodeError) {
          console.error("Error al decodificar el token:", decodeError);
        }
      }
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
          Iniciar sesión
        </h2>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Nombre de usuario"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              id="password"
              name="password"
              type="password"
              required
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
            Iniciar sesión
          </button>
        </form>

        <p className="text-sm text-center text-gray-300 mt-6">
          ¿No tienes una cuenta?{" "}
          <a
            href="/register"
            className="text-yellow-400 hover:text-yellow-300 font-medium"
          >
            Registrarse
          </a>
        </p>
      </div>
    </div>
  );
}
