using GTreasury.NetPresentValue.Domain.Enums;

namespace GTreasury.NetPresentValue.Application.Strategies;

public class CalculationStrategyFactory<TRequest, TResponse>(IEnumerable<ICalculationStrategy<TRequest, TResponse>> strategies) : ICalculationStrategyFactory<TRequest, TResponse>
{
    private readonly Dictionary<CalculationType, ICalculationStrategy<TRequest, TResponse>> _strategies = strategies.ToDictionary(s => s.CalculationType, s => s);

    public ICalculationStrategy<TRequest, TResponse> GetStrategy(CalculationType type)
    {
        if (_strategies.TryGetValue(type, out var strategy))
        {
            return strategy;
        }

        throw new KeyNotFoundException($"Strategy not found for type {type}");
    }
}
