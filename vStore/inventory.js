export const carouselItems = [
  {
    id: "sabina-dress",
    name: "Sabina Dress",
    src: "https://co.silviatcherassi.com/cdn/shop/files/91_SabinaDress_White__PRESPRING2026_FRONT.jpg?v=1771536063&width=1000",
  },
  {
    id: "rowan-dress",
    name: "Rowan Dress",
    src: "//co.silviatcherassi.com/cdn/shop/files/89_RowanDress_White__PRESPRING2026_FRONT.jpg?v=1771535925&width=1000",
  },
  {
    id: "norma-dress",
    name: "Norma Dress",
    src: "https://co.silviatcherassi.com/cdn/shop/files/80___Norma_Dress___Vanilla___PRE_SPRING_2026_FRONT_4b5ba98e-1241-4ad1-a9e1-05181b9a069e.jpg?v=1757978129&width=1000",
  },
  {
    id: "naga-dress",
    name: "Naga Dress",
    src: "https://co.silviatcherassi.com/cdn/shop/files/55___Naga_Dress___Tangerine___PRE_SPRING_2026_FRONT.jpg?v=1757883456&width=1000",
  },
  {
    id: "asher-dress",
    name: "Asher Dress",
  },
];

export function getItemById(id) {
  return carouselItems.find((item) => item.id === id) ?? null;
}
