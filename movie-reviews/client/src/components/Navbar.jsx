import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUser, getUserIdFromToken } from '../services/userService';

const publicNavigation = [
  { name: 'Top 20', href: '/top20', current: false },
];

const privateNavigation = [
  { name: 'Top 20', href: '/top20', current: false },
];

const mobileNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Top 20', href: '/top20' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const [isLogged, setIsLogged] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = getUserIdFromToken(token);

  useEffect(() => {
    if (Boolean(localStorage.getItem('token')) !== isLogged) {
      setIsLogged(Boolean(localStorage.getItem('token')));
    }
  }, []);

  const onSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    async function fetchProfile() {
      if (userId) {
        const data = await fetchUser(userId);
        setProfilePhoto(data.profilePhoto);
      }
    }
    fetchProfile();
  }, [userId]);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      try {
        const response = await fetch(`http://localhost:5213/api/movies/search?query=${query}`);
        if (response.ok) {
          const movies = await response.json();
          setSearchResults(movies);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile Menu Button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>

              {/* Logo and Navigation Links */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                {/* Hide logo on small screens */}
                <Link to="/" className="hidden sm:block">
                  <img
                    alt="Logo nav"
                    src="/images/logo1.png"
                    className="h-8 w-auto rounded-md"
                  />
                </Link>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {(isLogged ? privateNavigation : publicNavigation).map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search Bar and User Menu */}
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="bg-gray-700 text-white rounded-md pl-10 pr-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600 w-48 sm:w-64"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  {searchResults.length > 0 && (
                    <div className="absolute bg-gray-800 text-white rounded-md mt-1 w-full shadow-lg z-10 max-h-60 overflow-y-auto">
                      {searchResults.map((movie) => (
                        <Link
                          to={`/movie/${movie.id}`}
                          key={movie.id}
                          className="flex items-center p-3 hover:bg-gray-700 cursor-pointer transition duration-200"
                        >
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className="w-12 h-16 rounded-md object-cover mr-4"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">{movie.title}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sign Up / Log In Links */}
                {!isLogged && (
                  <div className="hidden sm:flex space-x-4">
                    <Link
                      to="/signUp"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      Sign up
                    </Link>
                    <Link
                      to="/login"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      Log in
                    </Link>
                  </div>
                )}

                {/* User Menu */}
                {isLogged && (
                  <Menu as="div" className="relative ml-3">
                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600">
                      <img alt="" src={profilePhoto} className="h-8 w-8 rounded-full" />
                    </MenuButton>
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                      <MenuItem>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Your Profile
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={onSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {mobileNavigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
