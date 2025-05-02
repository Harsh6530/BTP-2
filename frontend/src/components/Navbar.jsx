import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">Gadget Store</Link>
        </div>

        <div className="navbar-center desktop-only">
          <Link to="/">Home</Link>
          <Link to="/my-listings">My Listings</Link>
          <Link to="/post-gadget">Post Gadget</Link>
        </div>

        <div className="navbar-right desktop-only">
          <button className="logout-button" onClick={onLogout}>Logout</button>
        </div>

        {/* Mobile Navigation */}
        <div className="mobile-only">
          <Menu as="div" className="relative">
            <Menu.Button className="mobile-menu-button">
              <Bars3Icon className="h-6 w-6" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="mobile-menu">
                <Menu.Item>
                  {({ active }) => <Link to="/" className={active ? 'active' : ''}>HOME</Link>}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => <Link to="/my-listings" className={active ? 'active' : ''}>MY LISTINGS</Link>}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => <Link to="/post-gadget" className={active ? 'active' : ''}>POST GADGET</Link>}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button onClick={onLogout} className={active ? 'active logout-button' : 'logout-button'}>
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </nav>
  );
}
