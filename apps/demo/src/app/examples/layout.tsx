export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className="h-[100svh] flex items-center justify-center"
    >
      <main 
        className="w-full max-w-sm p-4"
      >
        {children} 
      </main>
    </div>
  )
}
