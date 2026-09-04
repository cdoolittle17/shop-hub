// js/fluid_data.js

const fluidRules = [
    // ==========================================
    // DOMESTIC MANUFACTURERS (GM, Ford, Mopar)
    // ==========================================

    // --- FORD / LINCOLN / MERCURY ---
    { startYear: 2017, endYear: 2027, make: "Ford", model: "F-150", engine: "10-Speed Auto (10R80)", spec: "MERCON ULV", action: "shelf", bottle: "Motorcraft MERCON ULV", notes: "DO NOT USE BULK ATF." },
    { startYear: 2020, endYear: 2027, make: "Ford", model: "Explorer", engine: "10-Speed Auto (10R60)", spec: "MERCON ULV", action: "shelf", bottle: "Motorcraft MERCON ULV", notes: "DO NOT USE BULK ATF." },
    { startYear: 2009, endYear: 2027, make: "Ford", model: "All Other Models", engine: "Standard 6-Speed Auto", spec: "MERCON LV", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Covers 6R80, 6F35, 6F50." },
    { startYear: 1990, endYear: 2008, make: "Ford", model: "All Other Models", engine: "Standard 4/5-Speed Auto", spec: "MERCON V", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Covers older 4R70W, 4R100, etc." },
    { startYear: 2009, endYear: 2027, make: "Lincoln", model: "All Models", engine: "Standard 6-Speed Auto", spec: "MERCON LV", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "MERCON LV compatible." },
    { startYear: 1990, endYear: 2011, make: "Mercury", model: "All Models", engine: "Standard Auto", spec: "MERCON V / LV", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Check dipstick for V vs LV." },

    // --- GM (Chevy, GMC, Cadillac, Buick, Pontiac, Olds, Saturn) ---
    { startYear: 2019, endYear: 2027, make: "Chevrolet", model: "Silverado 1500", engine: "10-Speed Auto (10L80)", spec: "DEXRON ULV", action: "shelf", bottle: "ACDelco DEXRON ULV", notes: "DO NOT USE BULK ATF." },
    { startYear: 2019, endYear: 2027, make: "GMC", model: "Sierra 1500", engine: "10-Speed Auto (10L80)", spec: "DEXRON ULV", action: "shelf", bottle: "ACDelco DEXRON ULV", notes: "DO NOT USE BULK ATF." },
    { startYear: 1999, endYear: 2027, make: "Chevrolet", model: "4x4 Trucks & SUVs", engine: "Active Transfer Case", spec: "Auto-Trak II", action: "shelf", bottle: "ACDelco Auto-Trak II", notes: "Blue fluid for push-button transfer cases only." },
    { startYear: 1999, endYear: 2027, make: "GMC", model: "4x4 Trucks & SUVs", engine: "Active Transfer Case", spec: "Auto-Trak II", action: "shelf", bottle: "ACDelco Auto-Trak II", notes: "Blue fluid for push-button transfer cases only." },
    { startYear: 2006, endYear: 2027, make: "Chevrolet", model: "All Other Models", engine: "Standard 6/8/9-Speed Auto", spec: "DEXRON VI", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "GM's primary spec since 2006." },
    { startYear: 2006, endYear: 2027, make: "GMC", model: "All Other Models", engine: "Standard 6/8/9-Speed Auto", spec: "DEXRON VI", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "GM's primary spec since 2006." },
    { startYear: 2006, endYear: 2027, make: "Cadillac", model: "All Models", engine: "Standard Auto", spec: "DEXRON VI", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Exclude 10-speed variants." },
    { startYear: 2006, endYear: 2027, make: "Buick", model: "All Models", engine: "Standard Auto", spec: "DEXRON VI", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "" },
    { startYear: 1990, endYear: 2005, make: "Chevrolet", model: "All Models", engine: "Standard 4-Speed Auto", spec: "DEXRON III", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Superseded by Dexron VI." },
    { startYear: 1990, endYear: 2005, make: "GMC", model: "All Models", engine: "Standard 4-Speed Auto", spec: "DEXRON III", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Superseded by Dexron VI." },
    { startYear: 1990, endYear: 2010, make: "Pontiac", model: "All Models", engine: "Standard Auto", spec: "DEXRON III / VI", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "" },
    { startYear: 1990, endYear: 2009, make: "Saturn", model: "All Models", engine: "Standard Auto", spec: "DEXRON III / VI", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "" },
    { startYear: 1990, endYear: 2004, make: "Oldsmobile", model: "All Models", engine: "Standard Auto", spec: "DEXRON III", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "" },

    // --- CHRYSLER / DODGE / JEEP / RAM / PLYMOUTH ---
    { startYear: 2013, endYear: 2027, make: "Ram", model: "1500 / 2500", engine: "8-Speed Auto (ZF)", spec: "Mopar 8 & 9 Speed", action: "shelf", bottle: "Mopar 8 & 9 Speed ATF", notes: "ZF TorqueFlite. DO NOT use Bulk ATF." },
    { startYear: 2014, endYear: 2027, make: "Jeep", model: "Grand Cherokee", engine: "8-Speed Auto (ZF)", spec: "Mopar 8 & 9 Speed", action: "shelf", bottle: "Mopar 8 & 9 Speed ATF", notes: "ZF Transmission." },
    { startYear: 2014, endYear: 2027, make: "Dodge", model: "Charger / Challenger", engine: "8-Speed Auto (ZF)", spec: "Mopar 8 & 9 Speed", action: "shelf", bottle: "Mopar 8 & 9 Speed ATF", notes: "ZF Transmission." },
    { startYear: 2015, endYear: 2027, make: "Chrysler", model: "200 / Pacifica", engine: "9-Speed Auto (ZF)", spec: "Mopar 8 & 9 Speed", action: "shelf", bottle: "Mopar 8 & 9 Speed ATF", notes: "ZF 9HP." },
    { startYear: 1990, endYear: 2027, make: "Dodge", model: "All Other Models", engine: "Standard 4/5/6-Speed Auto", spec: "ATF+4", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Bulk covers ATF+4. Valvoline ATF+4 on shelf also approved." },
    { startYear: 1990, endYear: 2027, make: "Ram", model: "All Other Models", engine: "Standard 5/6-Speed Auto", spec: "ATF+4", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Typically 65RFE / 66RFE / 68RFE." },
    { startYear: 1990, endYear: 2027, make: "Jeep", model: "All Other Models", engine: "Standard Auto", spec: "ATF+4", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Wrangler 5-speeds (W5A580), etc." },
    { startYear: 1990, endYear: 2027, make: "Chrysler", model: "All Other Models", engine: "Standard Auto", spec: "ATF+4", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "300, Town & Country, etc." },
    { startYear: 1990, endYear: 2001, make: "Plymouth", model: "All Models", engine: "Standard Auto", spec: "ATF+3 / +4", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "" },

    // ==========================================
    // ASIAN MANUFACTURERS
    // ==========================================

    // --- HONDA / ACURA ---
    { startYear: 2014, endYear: 2027, make: "Honda", model: "All Models", engine: "CVT Transmission", spec: "Honda HCF-2", action: "shelf", bottle: "Honda Genuine HCF-2 CVT", notes: "Yellow cap. DO NOT mix with DW-1 or use Bulk." },
    { startYear: 1990, endYear: 2027, make: "Honda", model: "All Models", engine: "Standard Automatic (Non-CVT)", spec: "Honda DW-1 / Z1", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Bulk covers DW-1 and legacy Z1 specs." },
    { startYear: 2014, endYear: 2027, make: "Acura", model: "All Models", engine: "9-Speed Auto", spec: "Acura ATF Type 3.1", action: "shelf", bottle: "Acura ATF Type 3.1", notes: "ZF 9-speed. DO NOT use Bulk." },
    { startYear: 1990, endYear: 2027, make: "Acura", model: "All Models", engine: "Standard Auto (Non 9-Spd)", spec: "Honda DW-1 / Z1", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "" },

    // --- TOYOTA / LEXUS / SCION ---
    { startYear: 2007, endYear: 2027, make: "Toyota", model: "All Models", engine: "Standard 6/8/10-Speed Auto", spec: "Toyota WS", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Bulk is WS compatible." },
    { startYear: 1990, endYear: 2006, make: "Toyota", model: "All Models", engine: "Standard 4/5-Speed Auto", spec: "Toyota T-IV", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Bulk covers T-IV." },
    { startYear: 2007, endYear: 2027, make: "Lexus", model: "All Models", engine: "Standard Auto", spec: "Toyota WS", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "" },
    { startYear: 1990, endYear: 2006, make: "Lexus", model: "All Models", engine: "Standard Auto", spec: "Toyota T-IV", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "" },
    { startYear: 2004, endYear: 2016, make: "Scion", model: "All Models", engine: "Standard Auto", spec: "Toyota WS / T-IV", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Depends on year." },

    // --- NISSAN / INFINITI ---
    { startYear: 2013, endYear: 2027, make: "Nissan", model: "All Models", engine: "CVT Transmission", spec: "Nissan NS-3", action: "shelf", bottle: "Nissan CVT Fluid NS-3", notes: "DO NOT use Bulk ATF." },
    { startYear: 2007, endYear: 2012, make: "Nissan", model: "All Models", engine: "CVT Transmission", spec: "Nissan NS-2", action: "shelf", bottle: "Valvoline CVT", notes: "Requires NS-2 compatibility." },
    { startYear: 1990, endYear: 2027, make: "Nissan", model: "All Models", engine: "Standard Auto (Trucks/RWD)", spec: "Nissan Matic S / J / D", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Bulk covers Matic D, J, K, and S." },
    { startYear: 2013, endYear: 2027, make: "Infiniti", model: "All Models", engine: "CVT Transmission", spec: "Nissan NS-3", action: "shelf", bottle: "Nissan CVT Fluid NS-3", notes: "DO NOT use Bulk ATF." },
    { startYear: 1990, endYear: 2027, make: "Infiniti", model: "All Models", engine: "Standard Auto", spec: "Nissan Matic S / J", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "" },

    // --- HYUNDAI / KIA / GENESIS ---
    { startYear: 2011, endYear: 2027, make: "Hyundai", model: "All Models", engine: "Standard Auto", spec: "Hyundai SP-IV / SP-IV-M", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Bulk covers SP-IV series." },
    { startYear: 1990, endYear: 2010, make: "Hyundai", model: "All Models", engine: "Standard Auto", spec: "Hyundai SP-III", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "" },
    { startYear: 2011, endYear: 2027, make: "Kia", model: "All Models", engine: "Standard Auto", spec: "Kia SP-IV", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "" },
    { startYear: 1990, endYear: 2010, make: "Kia", model: "All Models", engine: "Standard Auto", spec: "Kia SP-III", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "" },
    { startYear: 2017, endYear: 2027, make: "Genesis", model: "All Models", engine: "Standard Auto", spec: "SP-IV-RR", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "RWD spec covered by Bulk." },

    // --- SUBARU ---
    { startYear: 2010, endYear: 2027, make: "Subaru", model: "All Models", engine: "CVT (Lineartronic)", spec: "Subaru CVTF-II", action: "shelf", bottle: "Valvoline CVT", notes: "Check Valvoline CVT label for Subaru CVTF-II approval." },
    { startYear: 1990, endYear: 2014, make: "Subaru", model: "All Models", engine: "Standard 4/5-Speed Auto", spec: "Subaru ATF / ATF-HP", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Bulk covers ATF-HP." },

    // --- MAZDA ---
    { startYear: 2012, endYear: 2027, make: "Mazda", model: "All Models", engine: "Skyactiv 6-Speed Auto", spec: "Mazda ATF FZ", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Blue fluid from OEM, but Bulk sheet confirms FZ compatibility." },
    { startYear: 1990, endYear: 2012, make: "Mazda", model: "All Models", engine: "Standard Auto", spec: "Mazda M-III / M-V", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "" },

    // --- MITSUBISHI ---
    { startYear: 2008, endYear: 2027, make: "Mitsubishi", model: "All Models", engine: "CVT Transmission", spec: "DiaQueen CVTF-J1 / J4", action: "shelf", bottle: "Valvoline CVT", notes: "Verify CVT label for J4." },
    { startYear: 1990, endYear: 2027, make: "Mitsubishi", model: "All Models", engine: "Standard Auto", spec: "DiaQueen SP-III / SP-IV", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "" },

    // --- SUZUKI & ISUZU ---
    { startYear: 1990, endYear: 2013, make: "Suzuki", model: "All Models", engine: "Standard Auto", spec: "Suzuki 3314 / 3317", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Often takes JWS 3309, covered by bulk." },
    { startYear: 1990, endYear: 2008, make: "Isuzu", model: "All Models", engine: "Standard Auto", spec: "Dexron III / Besco ATF", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "" },

    // ==========================================
    // EUROPEAN MANUFACTURERS
    // ==========================================

    // --- VOLKSWAGEN / AUDI / PORSCHE ---
    { startYear: 2004, endYear: 2027, make: "Volkswagen", model: "All Models", engine: "DSG (Dual Clutch)", spec: "VW TL 521 82", action: "dealer", bottle: "Specialty DSG Fluid", notes: "DO NOT USE BULK OR STANDARD ATF. Requires DSG/DCT fluid." },
    { startYear: 2004, endYear: 2027, make: "Audi", model: "All Models", engine: "DSG / S-Tronic", spec: "VW TL 521 82", action: "dealer", bottle: "Specialty DSG Fluid", notes: "DO NOT USE BULK. Requires DSG/DCT fluid." },
    { startYear: 2011, endYear: 2027, make: "Volkswagen", model: "Touareg / Atlas", engine: "8-Speed Auto (Non-DSG)", spec: "G 060 162 (ZF8)", action: "shelf", bottle: "Mopar 8/9 Speed or ZF8", notes: "Cross-compatible with ZF 8-speed fluids." },
    { startYear: 2011, endYear: 2027, make: "Audi", model: "All Models", engine: "8-Speed Tiptronic (ZF8)", spec: "G 060 162", action: "shelf", bottle: "Mopar 8/9 Speed or ZF8", notes: "ZF 8HP Transmission." },
    { startYear: 1990, endYear: 2010, make: "Volkswagen", model: "All Models", engine: "Standard Tiptronic", spec: "G 052 162 / G 055 025", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Bulk covers most pre-2010 VW Tiptronics." },
    { startYear: 1990, endYear: 2010, make: "Audi", model: "All Models", engine: "Standard Tiptronic", spec: "G 052 162 / G 055 025", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Bulk covers most pre-2010 Tiptronics." },
    { startYear: 1990, endYear: 2027, make: "Porsche", model: "All Models", engine: "All Transmissions", spec: "PDK / ZF", action: "dealer", bottle: "Dealer Fluid", notes: "Consult ALLDATA. PDK requires special fluid." },

    // --- BMW / MINI ---
    { startYear: 2010, endYear: 2027, make: "BMW", model: "All Models", engine: "8-Speed Auto (ZF8)", spec: "ZF Lifeguard 8", action: "shelf", bottle: "Mopar 8/9 Speed or ZF8", notes: "ZF 8HP Transmission." },
    { startYear: 2002, endYear: 2013, make: "BMW", model: "All Models", engine: "6-Speed Auto (ZF6)", spec: "ZF Lifeguard 6", action: "shelf", bottle: "ZF Lifeguard 6", notes: "Some may use Bulk, check ALLDATA for pan tag." },
    { startYear: 1990, endYear: 2005, make: "BMW", model: "All Models", engine: "4/5-Speed Auto", spec: "LT71141 / Dexron III", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Bulk covers LT71141." },
    { startYear: 2002, endYear: 2027, make: "MINI", model: "All Models", engine: "All Transmissions", spec: "JWS 3309 / AW-1", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Bulk covers Aisin AW-1 and 3309." },

    // --- MERCEDES-BENZ ---
    { startYear: 2011, endYear: 2027, make: "Mercedes-Benz", model: "All Models", engine: "7G-Tronic Plus / 9G-Tronic", spec: "MB 236.15 / 236.17", action: "dealer", bottle: "Dealer Blue/Gold Fluid", notes: "Blue (236.15) or Gold/Yellow (236.17). Do not use Bulk." },
    { startYear: 1990, endYear: 2010, make: "Mercedes-Benz", model: "All Models", engine: "5G-Tronic / Early 7G", spec: "MB 236.10 / 236.14", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Bulk covers 236.10, .11, .12, .14." },

    // --- VOLVO ---
    { startYear: 2014, endYear: 2027, make: "Volvo", model: "All Models", engine: "8-Speed Auto (Aisin)", spec: "AW-1 / Volvo 31256774", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Bulk explicitly covers AW-1 and Volvo PN 31256774." },
    { startYear: 1990, endYear: 2013, make: "Volvo", model: "All Models", engine: "5/6-Speed Auto", spec: "JWS 3309 / AW-1", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Bulk covers JWS 3309." },

    // --- LAND ROVER / JAGUAR ---
    { startYear: 2012, endYear: 2027, make: "Land Rover", model: "All Models", engine: "8/9-Speed Auto", spec: "ZF Lifeguard 8/9", action: "shelf", bottle: "Mopar 8/9 Speed or ZF", notes: "ZF Transmissions." },
    { startYear: 1990, endYear: 2011, make: "Land Rover", model: "All Models", engine: "Older 6-Speed", spec: "ZF Lifeguard 6", action: "shelf", bottle: "ZF Lifeguard 6", notes: "" },
    { startYear: 2012, endYear: 2027, make: "Jaguar", model: "All Models", engine: "8-Speed Auto", spec: "ZF Lifeguard 8", action: "shelf", bottle: "Mopar 8/9 Speed or ZF8", notes: "" },

    // --- FIAT / ALFA ROMEO ---
    { startYear: 2017, endYear: 2027, make: "Alfa Romeo", model: "Giulia / Stelvio", engine: "8-Speed Auto", spec: "ZF Lifeguard 8", action: "shelf", bottle: "Mopar 8/9 Speed or ZF8", notes: "ZF 8HP." },
    { startYear: 2012, endYear: 2027, make: "Fiat", model: "All Models", engine: "Standard Auto", spec: "AW-1", action: "bulk", bottle: "OILPRO Full Synthetic MV ATF", notes: "Aisin AW-1 is covered by bulk." }
];

// ==========================================
// UNPACK SCRIPT (Do not edit below this line)
// ==========================================
const fluidDatabase = [];

fluidRules.forEach(rule => {
    for (let y = rule.startYear; y <= rule.endYear; y++) {
        fluidDatabase.push({
            year: y.toString(),
            make: rule.make,
            model: rule.model,
            engine: rule.engine,
            spec: rule.spec,
            action: rule.action,
            bottle: rule.bottle,
            notes: rule.notes
        });
    }
});