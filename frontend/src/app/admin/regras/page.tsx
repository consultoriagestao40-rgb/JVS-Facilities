import RegrasCCTManager from "@/components/admin/RegrasCCTManager";

export default function AdminRegrasPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Painel de Administração</h1>
            <p className="text-gray-500 mb-8">Gerencie as regras de negócio, convenções coletivas e parametrizações do sistema.</p>

            <RegrasCCTManager />
        </div>
    );
}
