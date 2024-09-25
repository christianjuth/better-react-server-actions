export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-10">
      <div>
        {children}
      </div>
      <footer className="flex justify-center gap-10 underline">
        <a 
          className="text-blue-500"
          href="https://github.com/christianjuth/better-react-server-actions/tree/main/apps/demo/src/app/examples/like-button" 
          target="_blank"
          rel="noopener noreferrer"
        >
          Source Code
        </a>
        <a 
          className="text-blue-500"
          href="https://christianjuth.github.io/better-react-server-actions/examples/like-button" 
          target="_blank"
          rel="noopener noreferrer"
        >
          Docs
        </a>
      </footer>
    </div>
  );
}
