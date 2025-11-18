import { Member } from "@/types/members";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
};

export const getCompanyInfo = (member: Member) => {
  if (member.ownedCompany) {
    // Use real user count if users array is available, otherwise fallback to userCount
    const realUserCount = member.ownedCompany.users?.length || member.ownedCompany.userCount;
    
    return {
      id: member.ownedCompany.id,
      name: member.ownedCompany.name,
      userCount: realUserCount,
      status: member.ownedCompany.status
    };
  }
  return null;
};

export const getPlanInfo = (member: Member) => {
  // All users now have companies, so always use company plan
  if (member.ownedCompany && member.ownedCompany.plan) {
    return {
      name: member.ownedCompany.plan.plan,
      price: member.ownedCompany.plan.price
    };
  }
  
  return null;
};

export const getExpirationInfo = (member: Member) => {
  let endDate: string | null = null;
  
  // All users are companies now, so get expiration from company benefits
  if (member.ownedCompany && member.ownedCompany.benefits.length > 0) {
    endDate = member.ownedCompany.benefits[0].endDate;
  }
  
  if (endDate) {
    const expirationDate = new Date(endDate);
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let daysLeftText: string;
    if (daysLeft > 0) {
      daysLeftText = `${daysLeft} days left`;
    } else if (daysLeft === 0) {
      daysLeftText = "Expires today";
    } else {
      daysLeftText = `Expired ${Math.abs(daysLeft)} days ago`;
    }
    
    return {
      date: formatDate(endDate),
      daysLeft: daysLeftText,
    };
  }
  
  return null;
};