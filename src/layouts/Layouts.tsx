import { Outlet } from 'react-router-dom'

function Layouts() {
  return (
    <div>
        <main>
        <Outlet/>
      </main>
      
    </div>
  )
}

export default Layouts
