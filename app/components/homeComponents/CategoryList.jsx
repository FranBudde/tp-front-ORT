export default function CategoryList({ categories, totalAmount, onCategoryClick }) {
  return (
    <section className="mx-4 space-y-3">
      {Array.isArray(categories) && categories.map((category) => {
        const calculatedPercentage = totalAmount > 0
          ? ((category.value / totalAmount) * 100).toFixed(2)
          : 0;

        return (
          <div
            key={category.id}
            className="bg-gray-800/80 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => onCategoryClick(category.id)}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full ${category.bgColor} flex items-center justify-center text-xl`}
              >
                {category.icon}
              </div>
              <span className="text-lg font-medium">{category.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-lg">{calculatedPercentage}%</span>
              <span className="text-xl font-medium">${category.value}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}