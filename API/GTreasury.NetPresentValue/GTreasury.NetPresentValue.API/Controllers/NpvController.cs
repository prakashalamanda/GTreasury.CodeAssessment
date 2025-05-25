using GTreasury.NetPresentValue.Application.Services;
using GTreasury.NetPresentValue.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace GTreasury.NetPresentValue.API.Controllers;

[ApiController]
[Route("api/npv")]
public class NpvController(ICalculatorService calculatorService) : ControllerBase
{
    private readonly ICalculatorService _calculatorService = calculatorService;

    [HttpPost("calculate")]
    public async Task<ActionResult<IEnumerable<NpvResponse>>> Calculate([FromBody] NpvRequest request)
    {
        //// No ModelState check added as ApiController takes care of it
        //// No try-catch added as  exceptions are handled globally by the exception handler.
        var results = await _calculatorService.CalculateNetPresentValue(request);

        return Ok(results);
    }
}
