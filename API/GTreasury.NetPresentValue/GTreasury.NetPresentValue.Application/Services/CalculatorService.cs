using GTreasury.NetPresentValue.Application.Strategies;
using GTreasury.NetPresentValue.Domain.Enums;
using GTreasury.NetPresentValue.Domain.Models;

namespace GTreasury.NetPresentValue.Application.Services;

public class CalculatorService(ICalculationStrategyFactory<NpvRequest, IEnumerable<NpvResponse>> factory) : ICalculatorService
{
    private readonly ICalculationStrategyFactory<NpvRequest, IEnumerable<NpvResponse>> _factory = factory;

    public Task<IEnumerable<NpvResponse>> CalculateNetPresentValue(NpvRequest request)
    {
        var strategy = _factory.GetStrategy(CalculationType.NetPresentValue);
        var result = strategy.Calculate(request);

        return Task.FromResult(result);
    }
}
