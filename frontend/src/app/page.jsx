export default function Home() {
  return (
    <main style={{ padding: '3rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#ff4500' }}>Welcome to DrinkIt 🍻</h1>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
        The frontend is successfully running on port 3000!<br/>
        The backend API is running on port 5000.
      </p>
    </main>
  )
}
