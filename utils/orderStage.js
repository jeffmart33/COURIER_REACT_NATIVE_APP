const STAGES = {
  accepted: "Assigned",
  en_route_to_pickup: "Heading to Restaurant",
  heading_to_restaurant: "Heading to Restaurant",
  arrived_pickup: "Arrived at Restaurant",
  arrived_restaurant: "Arrived at Restaurant",
  picked_up: "Picked Up",
  in_transit: "On the Way",
  on_the_way: "On the Way",
  arrived_delivery: "Arrived at Customer Address",
  arrived_customer: "Arrived at Customer Address",
  delivered: "Delivered",
};

export const stageOf = (status) => STAGES[status] || null;
