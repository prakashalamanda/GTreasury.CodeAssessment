using System.ComponentModel.DataAnnotations;

namespace GTreasury.NetPresentValue.Domain.Models;

public class NpvRequest
{
    [Required]
    [Range(0.01, 100)]
    public decimal LowerBoundRate { get; set; }

    [Required]
    [Range(0.01, 100)]
    public decimal UpperBoundRate { get; set; }

    [Required]
    [Range(0.01, 100)]
    public decimal IncrementRate { get; set; }

    [Required]
    [MinLength(1, ErrorMessage = "At least one cash flow is required.")]
    public List<decimal> CashFlows { get; set; } = [];
}
