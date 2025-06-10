"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({});
    const [error, setError] = useState("");
    // const [userId, setUserID] = useState("");
    // const [username, setUserName] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          
            throw new Error(data.message || "Error al iniciar sesión");
        }
    
        if (data.token) {
          localStorage.setItem("token", data.token);
          try {
            const decodedToken = jwtDecode(data.token);
            const userIdFromToken = decodedToken.userId;
            // const username = decodedToken.username;

            // setUserID(userIdFromToken)
            // setUserName(username)
            router.push(`/${userIdFromToken}/home`);
  
          } catch (decodeError) {
            console.error("Error al decodificar el token:", decodeError);
            // Manejar el error de decodificación si el token es inválido localmente
          }
          
        }
      } catch (err) {
        setError(err.message || "Error al conectar con el servidor");
      }
    };
    
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev, 
        [name]: value
    }));    
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar sesión
          </h2>
        </div>
        
        { error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div> )
        }

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nombre de usuario"
                onChange={handleChange}                                
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"  
                onChange={handleChange}              
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              Iniciar sesión
            </button>
          </div>

          <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Registrarse
            </a>
          </p>
        </div>
        </form>
      </div>
    </div>
  );
}