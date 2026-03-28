export default function TopBar() {
    return (
        <div className="flex justify-between items-center mt-5 mb-10 px-4 lg:px-10">
            <h1 className="text-primary text-4xl lg:text-5xl font-bold">
                El Dato
            </h1>
            <ul className="hidden lg:flex gap-6 font-semibold text-muted">
                <li className="hover:text-primary cursor-pointer transition-colors">Inicio</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Precios</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Aportar</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Perfil</li>
            </ul>
        </div>
    );
}
