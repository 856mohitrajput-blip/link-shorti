'use client';

export default function TermsOfServicePage() {
  return (
      <div className="mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500 drop-shadow-md">
            Terms of Service
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Please read these terms of service carefully before using Link Shorti&apos;s services.
          </p>
        </div>

        <div className="space-y-8 sm:space-y-12 max-w-6xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-700"></div>
            <div className="relative bg-white  rounded-2xl p-6 sm:p-8 md:p-10 transition-transform transform group-hover:scale-[1.02]">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-5 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                Agreement to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                linkshorti.com allows publishers to shorten any URL and earn money by sharing
                the shortened URLs online. Advertising is shown to the viewer on their way to
                their destination URL. By using the Site&apos;s service, you agree that the Site
                includes advertisements on the shortened URLs which is a requirement for the
                Site to operate.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-700"></div>
            <div className="relative bg-white  rounded-2xl p-6 sm:p-8 md:p-10 transition-transform transform group-hover:scale-[1.02]">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-5 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                Prohibited Activities
              </h2>
              <p className="text-gray-700 mb-4 sm:mb-5 leading-relaxed">
                By using the Site&apos;s service, you agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-3">
                <li>
                  Use the Service for any illegal or unauthorised purpose including but not
                  limited to copyright content, defaming, child pornography, threatening,
                  stalking, abuse, harassing or violating any person&apos;s or entity&apos;s legal rights;
                </li>
                <li>Advertise linkshorti.com links on any Traffic exchange, PTC and Faucet websites.</li>
                <li>
                  Place shortened links on websites containing content that may be threatening,
                  defamatory, harassing, obscene, contain any viruses, Trojan horses, time bombs,
                  worms, cancelbots or contain software which may cause damage to the viewer or
                  the Site&apos;s server.
                </li>
                <li>Shrink URLs which redirect to websites containing the above mentioned content.</li>
                <li>Spam any website, forum or blog with the Site&apos;s links.</li>
                <li>Offer an incentive or beg a visitor to click on your shortened links.</li>
                <li>Automatically redirect to your shortened url from a website. The viewer must click on the link him/herself;</li>
                <li>Create multiple accounts. Only one account per person is allowed;</li>
                <li>
                  Bring fake/automated traffic of any kind to your links. This will get your
                  account terminated automatically by our system. Manipulation of our system to
                  gain views is also not allowed. This includes iframes, redirects, proxies,
                  bots, traffic exchange, PTC, Faucet traffic, Email traffic, jingling, hitleap
                  etc.
                </li>
                <li>Interfere with other publishers which are using the Site&apos;s service.</li>
                <li>Transmit files that contain viruses, spyware, adware, trojans or other harmful code.</li>
                <li>Create &apos;redirect loops&apos; with linkshorti URLs or similar services to generate revenue.</li>
                <li>Click on your own shortened urls to generate revenue. We reserve the right to not pay for the revenue generated.</li>
                <li>Abuse from the contact system such as sending messages regarding payments before due dates, threatening to change service and/or providing false or incomplete data.</li>
                <li>Sending very low quality traffic to your shorten link is not accepted</li>
                <li>Open your shortened URLs using an iframe or popups/popunder.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
}