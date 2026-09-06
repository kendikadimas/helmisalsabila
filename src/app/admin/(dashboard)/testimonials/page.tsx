import { getAllTestimonialsAdmin } from "@/actions/testimonials";
import TestimonialsClientManager from "@/components/admin/TestimonialsClientManager";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonialsAdmin();

  return <TestimonialsClientManager initialTestimonials={testimonials} />;
}
