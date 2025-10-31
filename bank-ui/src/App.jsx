import { useState } from 'react'

import './App.css'
import { Outlet, useNavigate } from 'react-router-dom'
function App() {

  const [customer, setCustomer] = useState(() => {
    const stored = localStorage.getItem("customer");
  });

  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: false , isAllowed: (customer!=null)},
    { name: "Login", href: "/login", current: false , isAllowed: (customer==null)},
    { name: "Home", href: "/home", current: false , isAllowed: true},
    { name: "Architecture", href: "/arch", current: false , isAllowed: true},
  ];
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const [menuOpen, setMenuOpen] = useState(false);

  return (
  <>
    <nav className="bg-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1571867424488-4565932edb41?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987"
              alt="Logo"
              className="h-12 w-auto rounded-md"
            />
            <span className="ml-3 font-semibold text-xl text-white">Payment's</span>
          </div>


          {/* Desktop Menu */}
          <div className="hidden sm:flex space-x-6">
            {navigation.map((item) => (
               item.isAllowed && (
                  <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700",
                    "rounded-md px-3 py-2 text-sm font-medium"
                  )}
                >
                  {item.name}
                </a>
               )
            ))}
          </div>

          {/* Mobile Button */}
          <button
            className="sm:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden px-2 pt-2 pb-3 space-y-1 bg-gray-800">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-700",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </nav>


    <Outlet />
  </>
  )
}


export default App
