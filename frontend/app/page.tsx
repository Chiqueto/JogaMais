import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex  items-center h-screen bg-main-500 flex-col text-zinc-50 ">
      <h1 className="font-logo text-6xl mt-4 ">Joga +</h1>
      <Carousel>
        <CarouselContent>
          <CarouselItem className="flex flex-col items-center"><p className="text-2xl">Encontre campeonatos de sua modalidade preferida perto de você!</p><Image src="/beach_volley_home.svg" alt="Imagem vôlei de praia" width={320} height={320} /></CarouselItem>
          <CarouselItem>...</CarouselItem>
          <CarouselItem>...</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div >
  );
}
