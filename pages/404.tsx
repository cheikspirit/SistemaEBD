import Link from 'next/link'

export default function Custom404() {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', paddingTop: '50px' }}>
      <h1>404 - Página não encontrada</h1>
      <p>Lamentamos, mas não conseguimos encontrar a página que procura.</p>
      <Link href="/">Voltar para o Início</Link>
    </div>
  )
}
