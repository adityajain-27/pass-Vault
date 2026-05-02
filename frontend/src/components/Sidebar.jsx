import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getEntries } from '../api/vault.api';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const entries = await getEntries();
                const uniqueCats = [...new Set(entries.map(e => e.category || 'General'))];
                setCategories(uniqueCats);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    const navItems = [
        { name: 'My Vault', path: '/dashboard', icon: '🔑' },
        { name: 'Credit Cards', path: '/cards', icon: '💳' },
        { name: 'Secure Notes', path: '/notes', icon: '📋' },
        { name: 'Password Generator', path: '/generator', icon: '⚡' },
        { name: 'Security Audit', path: '/security-audit', icon: '🛡️' },
        { name: 'BreachWatch', path: '/breach-watch', icon: '👁️' },
    ];

    return (
        <aside className="sidebar anim-sidebar">
            <div className="sidebar-header">
                <h1 className="logo-text">
                    <span>Pass</span>Vault
                </h1>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item, i) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        style={{ animationDelay: `${0.05 + i * 0.07}s` }}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-text">{item.name}</span>
                    </NavLink>
                ))}

                <div style={{ marginTop: '24px', marginBottom: '12px', paddingLeft: '14px', fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Folders
                </div>

                <NavLink to="/favorites" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">⭐</span>
                    <span className="nav-text">Favorites</span>
                </NavLink>

                {categories.map((cat, i) => (
                    <NavLink 
                        key={cat} 
                        to={`/dashboard?category=${encodeURIComponent(cat)}`} 
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        style={{ animationDelay: `${0.5 + i * 0.05}s` }}
                    >
                        <span className="nav-icon">📁</span>
                        <span className="nav-text">{cat}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={logout} className="logout-button">Logout</button>
            </div>

            <style>{`
                .sidebar {
                    width: 260px;
                    height: 100vh;
                    background: rgba(7, 9, 15, 0.95);
                    border-right: 1px solid rgba(255,255,255,0.07);
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    left: 0;
                    top: 0;
                    z-index: 100;
                    backdrop-filter: blur(20px);
                }
                .sidebar-header {
                    padding: 28px 24px 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .logo-text {
                    font-size: 1.4rem;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .logo-text span { color: #F5C518; }
                .sidebar-nav {
                    flex: 1;
                    padding: 16px 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .nav-link {
                    display: flex;
                    align-items: center;
                    padding: 11px 14px;
                    text-decoration: none;
                    color: rgba(255,255,255,0.45);
                    border-radius: 8px;
                    font-weight: 500;
                    font-size: 0.9rem;
                    transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
                    animation: navItemIn 0.4s ease both;
                }
                .nav-link:hover {
                    background: rgba(26,110,245,0.08);
                    color: rgba(255,255,255,0.9);
                    transform: translateX(3px);
                }
                .nav-link.active {
                    background: rgba(26,110,245,0.18);
                    color: #fff;
                    font-weight: 600;
                    border-left: 3px solid #1a6ef5;
                    padding-left: 11px;
                }
                .nav-link.active:hover { transform: none; }
                .nav-icon { width: 28px; font-size: 1rem; }
                .sidebar-footer {
                    padding: 20px 16px 28px;
                    border-top: 1px solid rgba(255,255,255,0.06);
                }
                .logout-button {
                    width: 100%;
                    padding: 10px;
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.4);
                    border-radius: 8px;
                    cursor: pointer;
                    font-family: inherit;
                    font-size: 0.875rem;
                    transition: all 0.18s ease;
                }
                .logout-button:hover {
                    border-color: rgba(239,68,68,0.4);
                    color: #ef4444;
                    background: rgba(239,68,68,0.06);
                }
                @keyframes navItemIn {
                    from { opacity: 0; transform: translateX(-16px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                .anim-sidebar {
                    animation: sidebarIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
                }
                @keyframes sidebarIn {
                    from { transform: translateX(-100%); opacity: 0; }
                    to   { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </aside>
    );
};

export default Sidebar;
