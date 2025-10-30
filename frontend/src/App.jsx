import { useState } from 'react'

import './App.css'

function App() {
 

  return (
    <>
      <div>
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form className="space-y-4">
        <input type="email" placeholder="Email" className="border p-2 w-full" />
        <input type="password" placeholder="Password" className="border p-2 w-full" />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
     
    </>
  )
}

export default App
