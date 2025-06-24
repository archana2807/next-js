export async function fetchData() {
  try {
    const res = await fetch('https://api.example.com/data')
    if (!res.ok) throw new Error('Failed to fetch data')
    return await res.json()
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}
