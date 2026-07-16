import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const style = document.createElement('style')
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f0c29; overflow: hidden; }
  #root { height: 100vh; }
`
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById('root')).render(<App />)