using System.ComponentModel.DataAnnotations;

namespace FranchiseManager.API.Models
{
    public class Product
    {
        // Unique identifier for the product
        public int Id { get; set; }

        // Product name - required field
        [Required(ErrorMessage = "Product name is required")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        [MinLength(2, ErrorMessage = "Name must be at least 2 characters long")]
        [Display(Name = "Product Name")]
        public string Name { get; set; } = string.Empty;

        // Stock quantity - cannot be negative
        [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative")]
        [Display(Name = "Stock Quantity")]
        public int Stock { get; set; }

        // Foreign key: ID of the branch where the product is located
        [Required(ErrorMessage = "Branch is required")]
        [Display(Name = "Branch ID")]
        public int BranchId { get; set; }

        // Navigation property: branch where the product is located
        public Branch? Branch { get; set; }
    }
}