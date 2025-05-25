using GTreasury.NetPresentValue.Domain.Enums;

namespace GTreasury.NetPresentValue.Application.Strategies;

public interface ICalculationStrategy<in TRequest, out TResponse>
{
    CalculationType CalculationType { get; }
    TResponse Calculate(TRequest request);
}
