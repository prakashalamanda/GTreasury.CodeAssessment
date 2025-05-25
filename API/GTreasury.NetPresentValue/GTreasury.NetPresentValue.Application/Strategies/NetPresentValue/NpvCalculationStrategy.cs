using GTreasury.NetPresentValue.Domain.Enums;
using GTreasury.NetPresentValue.Domain.Models;
using static GTreasury.NetPresentValue.Domain.NpvConstants;

namespace GTreasury.NetPresentValue.Application.Strategies.NetPresentValue;

public class NpvCalculationStrategy : ICalculationStrategy<NpvRequest, IEnumerable<NpvResponse>>
{
    public CalculationType CalculationType => CalculationType.NetPresentValue;

    public IEnumerable<NpvResponse> Calculate(NpvRequest request)
    {
        ValidateRequest(request);

        return GenerateNpvResponses(request);
    }

    private static void ValidateRequest(NpvRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (request.CashFlows == null || request.CashFlows.Count == 0)
        {
            throw new ArgumentException(ErrorMessages.CashFlowsRequired, nameof(request));
        }
        else if (request.IncrementRate <= 0)
        {
            throw new ArgumentException(ErrorMessages.IncrementRateInvalid, nameof(request));
        }
        else if (request.LowerBoundRate > request.UpperBoundRate)
        {
            throw new ArgumentException(ErrorMessages.LowerBoundLessThanUpperBound, nameof(request));
        }
        else if (request.LowerBoundRate < 0.01m || request.LowerBoundRate > 100.00m)
        {
            throw new ArgumentException(ErrorMessages.LowerBoundRateRange, nameof(request));
        }
        else if (request.UpperBoundRate < 0.01m || request.UpperBoundRate > 100.00m)
        {
            throw new ArgumentException(ErrorMessages.UpperBoundRateRange, nameof(request));
        }
    }

    private static IEnumerable<NpvResponse> GenerateNpvResponses(NpvRequest request)
    {
        for (var rate = request.LowerBoundRate; rate <= request.UpperBoundRate; rate += request.IncrementRate)
        {
            yield return new NpvResponse
            {
                DiscountRate = Math.Round(rate, 4),
                NetPresentValue = Math.Round(CalculateNpv(request.CashFlows, rate), 2)
            };
        }
    }

    private static decimal CalculateNpv(List<decimal> cashFlows, decimal rate)
    {
        var npv = 0m;
        var discountRate = rate / 100m;

        for (var periodIndex = 0; periodIndex < cashFlows.Count; periodIndex++)
        {
            npv += cashFlows[periodIndex] / (decimal)Math.Pow(1 + (double)discountRate, periodIndex);
        }

        return npv;
    }
}
