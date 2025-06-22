import Categories from "./Categories";
import PlantCareQuickTips from "./Plant-Care-Quick-Tips";
import PopularPosts from "./Popular-posts";
import VendorSpotlight from "./Vendor-spotlight";

const BlogSidebar = () => {
  return (
    <div className="space-y-8">
      <PopularPosts />
      <Categories />
      <PlantCareQuickTips />
      <VendorSpotlight />
    </div>
  );
};

export default BlogSidebar;