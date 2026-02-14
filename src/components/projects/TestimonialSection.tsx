import { useProjectTestimonials } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialSectionProps {
    projectId: string;
}

export function TestimonialSection({ projectId }: TestimonialSectionProps) {
    const { data: testimonials, isLoading } = useProjectTestimonials(projectId);

    if (isLoading) return <div>Loading testimonials...</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Testimonials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {testimonials?.length === 0 && <p className="text-muted-foreground">No testimonials yet.</p>}
                {testimonials?.map((t) => (
                    <div key={t.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold">{t.client_name}</h4>
                                <div className="flex text-yellow-500 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < (t.rating || 0) ? "fill-current text-yellow-500" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            {t.is_public && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Public</span>}
                        </div>
                        {t.feedback && <p className="mt-2 text-sm text-foreground/80 italic">"{t.feedback}"</p>}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
