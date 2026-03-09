using System.ComponentModel.DataAnnotations;

namespace FranchiseManager.API.Models
{
    public class Franchise
    {
        // Unique identifier for the franchise
        public int Id { get; set; }

        // Franchise name - required field
        [Required(ErrorMessage = "Franchise name is required")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        [MinLength(3, ErrorMessage = "Name must be at least 3 characters long")]
        [Display(Name = "Franchise Name")]
        public string Name { get; set; } = string.Empty;

        // Relationship: one franchise has many branches
        //public ICollection<Branch> Branches { get; set; } = new List<Branch>();
    }
}