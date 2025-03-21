import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <Button
        label="Reports"
        onClick={() => console.log("Reports button clicked")}
      />
    </>
  );
}