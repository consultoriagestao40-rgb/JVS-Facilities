"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSimulador } from '@/context/SimuladorContext';

const userSchema = z.object({
    nome: z.string().min(5, 'Nome deve ter no mínimo 5 caracteres'),
    empresa: z.string().min(3, 'Nome da empresa é obrigatório'),
    cnpj: z.string().min(14, 'CNPJ incompleto').max(18, 'CNPJ inválido'), // Add regex validation later
    email: z.string().email('E-mail inválido'),
    whatsapp: z.string().min(11, 'WhatsApp incompleto')
});

type UserFormData = z.infer<typeof userSchema>;

export default function CadastroInicial() {
    const { state, updateUserData, nextStep } = useSimulador();

    const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: state.userData
    });

    const onSubmit = (data: UserFormData) => {
        updateUserData(data);
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input
                        {...register('nome')}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Seu nome"
                    />
                    {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                    <input
                        {...register('empresa')}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Nome da sua empresa"
                    />
                    {errors.empresa && <p className="text-red-500 text-sm mt-1">{errors.empresa.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                    <input
                        {...register('cnpj')}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="00.000.000/0000-00"
                    />
                    {errors.cnpj && <p className="text-red-500 text-sm mt-1">{errors.cnpj.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Corporativo</label>
                    <input
                        {...register('email')}
                        type="email"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="voce@empresa.com.br"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                    <input
                        {...register('whatsapp')}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="(11) 99999-9999"
                    />
                    {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>}
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <button
                    type="submit"
                    className="bg-primary hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow transition-colors"
                >
                    Próximo Passo &rarr;
                </button>
            </div>
        </form>
    );
}
