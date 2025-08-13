import { FaArrowRight, FaCheck } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const features = [
  "Clinical Notes Summarization",
  "Choose your own word count for the new notes",
  "AI-powered symptom analyzer",
  "Clinical simulator",
  "Practice real-life patient scenarios",
];

export const VoidrBlogCta = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="max-w-5xl w-full">
            <div className="flex flex-col items-start justify-between gap-8 rounded-lg bg-gradient-to-r from-[#036873] to-[#4cc6d0] px-6 py-10 md:flex-row lg:px-20 lg:py-16 text-white">
              <div className="md:w-1/2">
                <h4 className="mb-1 text-2xl font-bold md:text-3xl">Join the VOIDR family</h4>
                <p className="mb-2">Voidr Health was started from humble beginnings and from lot of struggles. Someone worked hard to make this so that It can save others 100's of hours. Join while it's still Free!</p>
                <Button className="mt-6 bg-white text-[#036873] hover:bg-blue-100 font-bold" asChild>
                  <a href="/auth" target="_blank">
                    Join Now <FaArrowRight className="size-4 ml-2" />
                  </a>
                </Button>
              </div>
              <div className="md:w-1/3">
                <ul className="flex flex-col space-y-2 text-sm font-medium">
                  {features.map((item, idx) => (
                    <li className="flex items-center" key={idx}>
                      <FaCheck className="mr-4 size-4 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
