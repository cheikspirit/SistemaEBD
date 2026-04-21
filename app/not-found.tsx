import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Página não encontrada</h2>
      <p className="mb-6 text-gray-600">Lamentamos, mas não conseguimos encontrar a página que procura.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Voltar para o Início
      </Link>
    </div>
  )
}
