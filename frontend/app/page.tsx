import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex  items-center h-screen bg-main-500 flex-col">
      <h1 className="font-logo text-6xl mt-4 text-zinc-50">Joga +</h1>
      <Carousel>
        <CarouselContent>
          <CarouselItem><Image src="/beach_volley_home.svg" alt="Imagem vôlei de praia" width={500} height={500} /></CarouselItem>
          <CarouselItem>...</CarouselItem>
          <CarouselItem>...</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div >
  );
}
