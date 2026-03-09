using System.ComponentModel.DataAnnotations;

namespace FranchiseManager.API.DTOs
{
    // For GET responses (list/get)
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Stock { get; set; }
        public int BranchId { get; set; }
        public string BranchName { get; set; } = string.Empty; // Display branch name
        public string FranchiseName { get; set; } = string.Empty; // Display franchise name
    }

    // For creating a new product (POST)
    public class CreateProductDto
    {
        [Required(ErrorMessage = "Product name is required")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        [MinLength(2, ErrorMessage = "Name must be at least 2 characters long")]
        public string Name { get; set; } = string.Empty;

        [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative")]
        public int Stock { get; set; }

        [Required(ErrorMessage = "Branch is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Branch ID must be greater than zero")]
        public int BranchId { get; set; }
    }

    // For updating a product (PUT)
    public class UpdateProductDto
    {
        [Required(ErrorMessage = "Product name is required")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        [MinLength(2, ErrorMessage = "Name must be at least 2 characters long")]
        public string Name { get; set; } = string.Empty;

        [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative")]
        public int Stock { get; set; }
    }

    // Specific DTO for updating ONLY stock (functional requirement)
    public class UpdateProductStockDto
    {
        [Required(ErrorMessage = "Stock is required")]
        [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative")]
        public int Stock { get; set; }
    }
}