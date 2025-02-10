import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
    email: '',
    password: ''
}

function AuthLogin() {
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const { toast } = useToast();

    function onSubmit(event) {
        event.preventDefault();

        dispatch(loginUser(formData)).then(data => {
            if (data?.payload?.success) {
                toast({
                    title: data?.payload?.message
                });
            } else {
                toast({
                    title: data?.payload?.message,
                    variant: 'destructive'
                });
            }
        });
    }

    return (
        <div className="w-full max-w-md mx-auto max-h-full">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
                {/* Header Section */}
                <div className="text-center space-y-4 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        Bienvenido de Nuevo
                    </h1>
                    <p className="text-gray-600">
                        Inicia sesión en tu cuenta para continuar
                    </p>
                </div>

                {/* Form Section */}
                <div className="space-y-6">
                    <CommonForm
                        formControls={loginFormControls}
                        buttonText="Iniciar Sesión"
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={onSubmit}
                    />

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">O continúa con</span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="text-sm font-medium text-gray-700">Google</span>
                        </button>
                        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="text-sm font-medium text-gray-700">Facebook</span>
                        </button>
                    </div>

                    {/* Links Section */}
                    <div className="space-y-4 text-center mt-8">
                        <p className="text-gray-600">
                            ¿No tienes una cuenta?{' '}
                            <Link 
                                to="/auth/register" 
                                className="font-semibold text-pink-600 hover:text-pink-500 transition-colors"
                            >
                                Regístrate
                            </Link>
                        </p>
                        <Link 
                            to="/auth/recover-password" 
                            className="block text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8 text-center text-sm text-gray-500">
                Al iniciar sesión, aceptas nuestros{' '}
                <Link to="/terms" className="text-pink-600 hover:text-pink-500">
                    términos y condiciones
                </Link>
            </div>
        </div>
    );
}

export default AuthLogin;