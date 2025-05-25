using GTreasury.NetPresentValue.Domain.Enums;

namespace GTreasury.NetPresentValue.Application.Strategies;

public interface ICalculationStrategyFactory<TRequest, TResponse>
{
    ICalculationStrategy<TRequest, TResponse> GetStrategy(CalculationType type);
}
