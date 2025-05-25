using GTreasury.NetPresentValue.Domain.Models;

namespace GTreasury.NetPresentValue.Application.Strategies.NetPresentValue;

public interface INpvCalculationStrategy
{
    IEnumerable<NpvResponse> Calculate(NpvRequest request);
}
