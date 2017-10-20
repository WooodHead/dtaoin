import React from 'react';

export default function FinancingInfoFixed(props) {
  const { detail } = props;
  return (
    <div className="financing-info-fixed">
      <div>
        <p>
          <label className="label">首付金额</label>
          <span>{`${Number(detail.rent_down_payment).toFixed(2)  }元` || '--'}</span>
        </p>
        <p>
          <label className="label">月租</label>
          <span>{`${Number(detail.monthly_rent).toFixed(2)  }元` || '--'}</span>
        </p>
        <p>
          <label className="label">月供</label>
          <span>{`${Number(detail.monthly_finance).toFixed(2)  }元` || '--'}</span>
        </p>
        <p>
          <label className="label">保证金</label>
          <span>{`${Number(detail.cash_deposit).toFixed(2)  }元` || '--'}</span>
        </p>
      </div>

      <div>
        <p>
          <label className="label">残值</label>
          <span>{`${Number(detail.salvage_value).toFixed(2)  }元` || '--'}</span>
        </p>
        <p>
          <label className="label">租期</label>
          <span>{`${detail.rent_length_type  }期` || '--'}</span>
        </p>
        <p>
          <label className="label">融资期限</label>
          <span>{`${detail.finance_length_type  }期` || '--'}</span>
        </p>
        <p>
          <label className="label">服务费</label>
          <span>{`${Number(detail.service_fee).toFixed(2)  }元` || ''}</span>
        </p>
      </div>
    </div>
  );
}
