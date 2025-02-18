import HomeCarrousel from "./_components/homeCarrousel";

export default function Home() {
  return (
    <div className="flex items-center h-screen bg-main-500 flex-col text-zinc-50 ">
      <h1 className="font-logo text-6xl mt-4 ">Joga +</h1>
      <HomeCarrousel />
    </div >
  );
}
