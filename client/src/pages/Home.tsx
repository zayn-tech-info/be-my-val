import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";

export default function Home() {
  const createValentine = useMutation(api.valentines.create);

  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      alert("Please enter a valid receiver email address.");
      return;
    }
    if (senderEmail && !validateEmail(senderEmail)) {
      alert("Please enter a valid sender email address.");
      return;
    }

    setIsLoading(true);
    try {
      const id = await createValentine({
        senderName: name,
        senderEmail: senderEmail,
        receiverEmail: email,
        message: message,
      });
      setLink(`${window.location.origin}/v/${id}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-[#ffccd5] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-background-end rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-100 h-100 bg-background-start rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-4000 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-xl p-8 md:p-12 relative z-10 rounded-3xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#640d23] mb-3 tracking-tight">
            Ask Your Valentine <span className="text-primary">💘</span>
          </h1>
          <p className="text-lg text-[#800f2f]/80">
            Create a playful, interactive proposal link.
          </p>
        </div>

        {!link ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-modern"
              />

              <input
                type="email"
                placeholder="Your Email (Optional - for notifications)"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="input-modern"
              />

              <input
                type="email"
                placeholder="Their Email (Required)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern"
                required
              />

              <textarea
                placeholder="Custom Message (e.g. 'Will you be my Valentine?')"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-modern min-h-30 resize-none"
              />
            </div>

            <button
              type="submit"
              className="btn-modern mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Creating Magic..." : "Create Link ✨"}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎁</span>
              </div>
              <h2 className="text-2xl font-bold text-primary-dark mb-2">
                Link Created!
              </h2>
              <p className="text-[#640d23]/70">
                Your special question is ready to be asked.
              </p>
            </div>

            <div
              className="bg-white/50 border border-white p-4 rounded-xl mb-6 break-all font-mono text-sm text-primary-dark select-all cursor-pointer hover:bg-white/80 transition-colors"
              onClick={copyLink}
            >
              {link}
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={copyLink} className="btn-modern">
                Copy Link 📋
              </button>

              <a
                href={`mailto:${email}?subject=A Special Question For You 💌&body=Hey, I have something special to ask you: ${link}`}
                className="w-full py-4 px-8 bg-white border-2 border-[#ffccd5] text-primary-dark rounded-2xl text-lg font-bold transition-all duration-300 hover:bg-background-start hover:border-primary-dark text-center no-underline"
              >
                Send via Email 📧
              </a>

              <button
                onClick={() => setLink("")}
                className="text-sm text-[#800f2f] hover:underline mt-2"
              >
                Create Another
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
