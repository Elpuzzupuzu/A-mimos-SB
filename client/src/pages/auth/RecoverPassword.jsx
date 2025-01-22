import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

function RecoverPassword() {
    const [email, setEmail] = useState('');
    const { toast } = useToast();

    const handleRecoverPassword = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/auth/recover-password', { email });

            if (response.data.success) {
                toast({
                    title: response.data.message,
                });
            } else {
                toast({
                    title: response.data.message,
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.log(error,"mail",email)
            toast({
                title: 'Error al recuperar la contraseña',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Recover your password</h1>
            </div>
            <form onSubmit={handleRecoverPassword} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <button type="submit" className="w-full p-2 bg-primary text-white">Send Recovery Email</button>
            </form>
        </div>
    );
}

export default RecoverPassword;
