function getPerilRates(data)
{
  let policy = data.policy;
  console.log(JSON.stringify(data))
  console.log(data.operation)

  // This is the return object that we'll decorate with rating calculations
  let ret = { pricedPerilCharacteristics: {} };

  // For each peril characteristics, look at its peril to get a rating
  // factor and then multiply by vehicle value to get the premium.
  for (pep of data.policyExposurePerils)
  {
    let peril = getPerilFromPerilCharacteristicsLocator(policy, pep);
    let exposureCharacteristics = getExposureCharacteristicsFromExposureCharacteristicsLocator(policy, pep);
    let vehicleValue = parseFloat(exposureCharacteristics.fieldValues.vehicle_value[0]);

    let ratingFactor;

    switch (peril.name)
    {
      case "bodily_injury": ratingFactor = 52.0; break;
      case "collision": ratingFactor = 45.5; break;
      case "comprehensive": ratingFactor = 32.5; break;
      default: ratingFactor = 12.0; break;
    }

    let yearlyPremium = round2(vehicleValue * ratingFactor / 1000);
    ret.pricedPerilCharacteristics[pep.perilCharacteristicsLocator] = {
      yearlyPremium: yearlyPremium,
      yearlyTechnicalPremium: round2(yearlyPremium * 0.8),
      commissions:[
          {
            yearlyAmount: round2(yearlyPremium * 0.1),
            recipient: "broker_abc" // a code that specifies who gets the commission
          }
      ]
    }
  }
  return ret;
}