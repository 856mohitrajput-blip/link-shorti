"use client";
import React, { useState, useMemo, useEffect} from 'react';
import { useSession } from 'next-auth/react';
import { 
    Link as LinkIcon, Sparkles, Wand2, Search, Copy, Check, Trash2, ExternalLink,
} from 'lucide-react';

const SHORTENER_DOMAIN = process.env.NEXT_PUBLIC_SHORTENER_DOMAIN || 'https://yourdomain.com';

const formatNumber = (num, decimals = 0) => {
    if (num === undefined || num === null) return 'N/A';
    const numericNum = parseFloat(num);
    if (isNaN(numericNum)) return 'N/A';
    
    if (numericNum >= 1000000) return (numericNum / 1000000).toFixed(1) + 'M';
    if (numericNum >= 1000) return (numericNum / 1000).toFixed(1) + 'K';
    return numericNum.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const LinkCard = ({ link, onCopy, onDelete, isDeleting }) => {
    const [copied, setCopied] = useState(false);
    const fullShortUrl = `${SHORTENER_DOMAIN}/${link.shortUrl}`;

    const handleCopyClick = () => {
        onCopy(fullShortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm transition-shadow hover:shadow-md border border-slate-200/80">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex-grow min-w-0">
                    {link.alias && <p className="text-sm font-semibold text-purple-600">Alias: {link.alias}</p>}
                    <p className="text-sm text-slate-500 truncate">{link.originalUrl}</p>
                    <a href={fullShortUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-blue-600 hover:underline flex items-center gap-1">
                        {fullShortUrl.replace(/^https?:\/\//, '')}
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
                <div className="flex items-center gap-4 text-slate-500 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                    <div className="text-center">
                        <p className="font-bold text-slate-800">{formatNumber(link.clicks)}</p>
                        <p className="text-xs">Clicks</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleCopyClick} className="p-2 rounded-full hover:bg-slate-200 transition-colors" aria-label="Copy link" disabled={isDeleting}>
                            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                        <button onClick={() => onDelete(link._id)} className="p-2 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50" aria-label="Delete link" disabled={isDeleting}>
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ManageLinks = ({ links: fetchedLinksArray, fetchData }) => {
    const { data: session } = useSession();
    const [longUrl, setLongUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [links, setLinks] = useState(fetchedLinksArray || []);

    useEffect(() => {
        setLinks(fetchedLinksArray || []);
    }, [fetchedLinksArray]);

    const handleShorten = async (e) => {
        e.preventDefault();
        if (!session?.user?.email) {
            setIsError(true);
            setMessage('Authentication error: Please sign in again.');
            return;
        }
        const urlRegex = /^(https?:\/\/)[\w\-\.\/:]+\.[\w\-\.\/:]+([a-zA-Z0-9\-\.\/?%=&]*)?$/;
        if (!longUrl || !urlRegex.test(longUrl)) {
            setIsError(true);
            setMessage('Please enter a valid URL.');
            return;
        }
        const cleanedAlias = alias ? alias.trim().replace(/[^a-zA-Z0-9-]/g, '').toLowerCase() : '';
        if (cleanedAlias.length === 0) {
            setIsError(true);
            setMessage('A custom alias is required.');
            return;
        }
        
        const aliasToSend = cleanedAlias; 

        setIsSubmitting(true);
        setIsError(false);
        setMessage('');
        try {
            const response = await fetch('/api/create-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ originalUrl: longUrl, alias: aliasToSend, userEmail: session.user.email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create link.');
            setLinks([data.newLink, ...links]);
            setLongUrl('');
            setAlias('');
            setMessage(`Link created!`);
        } catch (error) {
            setIsError(true);
            setMessage(error.message || 'An error occurred.');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };
    
    const handleCopy = (fullShortUrl) => navigator.clipboard.writeText(fullShortUrl);
    
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this link?')) return;
        setIsDeleting(true);
        try {
            const response = await fetch('/api/delete-link', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ linkId: id, userEmail: session.user.email }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete link.');
            }
            setLinks(links.filter(link => link._id !== id));
            setMessage('Link deleted.');
        } catch (error) {
            setIsError(true);
            setMessage(error.message || 'Deletion failed.');
        } finally {
            setIsDeleting(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const filteredLinks = useMemo(() => {
        return links.filter(link => {
            const search = searchTerm.toLowerCase();
            return (
                link.originalUrl?.toLowerCase().includes(search) ||
                link.shortUrl?.toLowerCase().includes(search) ||
                link.alias?.toLowerCase().includes(search)
            );
        });
    }, [links, searchTerm]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 font-sans">
            <h2 className='text-3xl font-bold mb-6 text-slate-800'>Manage Links</h2>

            <div className='bg-white p-6 rounded-2xl shadow-md mb-8'>
                <form onSubmit={handleShorten}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input required type="text" value={longUrl} onChange={(e) => setLongUrl(e.target.value)} placeholder="Enter long URL" className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={isSubmitting} />
                        </div>
                        <div className="relative">
                            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="text" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Alias (custom name)" required className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={isSubmitting} />
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                        <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90 disabled:opacity-50" disabled={isSubmitting}>
                            <Wand2 className="w-5 h-5" />
                            {isSubmitting ? 'Shortening...' : 'Shorten'}
                        </button>
                        {message && <p className={`text-sm ${isError ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
                    </div>
                </form>
            </div>
            
            <div className="bg-white rounded-2xl shadow-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-6 pb-4">
                    <h3 className="text-xl font-semibold text-slate-800">Your Links ({links.length})</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search links..." className="w-full sm:w-80 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                
                <div className="space-y-4 p-6 pt-2">
                    {filteredLinks.length > 0 ? (
                        filteredLinks.map(link => <LinkCard key={link._id} link={link} onCopy={handleCopy} onDelete={handleDelete} isDeleting={isDeleting} />)
                    ) : (
                        <div className="text-center py-10 text-slate-500"><p>No links found.</p></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageLinks;