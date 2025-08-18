import InfiniteScroll from "@/components/InfinityScroll";

export default function Home() {
  return (
    <>
      <InfiniteScroll speed={2} pauseOnHover={true} gap={1} direction="left">
        {[1, 2, 3, 4, 5, 6].map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-200 p-20 w-[500px] flex items-center justify-center text-2xl font-bold"
          >
            {item}
          </div>
        ))}
      </InfiniteScroll>
      <InfiniteScroll
        speed={5}
        pauseOnHover={false}
        gap={1}
        direction="right"
        draggable={false}
      >
        {[1, 2, 3, 4, 5, 6].map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-200 p-20 w-[500px] flex items-center justify-center text-2xl font-bold"
          >
            {item}
          </div>
        ))}
      </InfiniteScroll>
    </>
  );
}
