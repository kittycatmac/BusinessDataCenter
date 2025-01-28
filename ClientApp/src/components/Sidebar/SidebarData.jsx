import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

export const SidebarData = [
  // {
  //   title: 'General',
  //   path: '/General',
  //   icon: <AiIcons.AiFillHome />,
  //   iconClosed: <RiIcons.RiArrowDownSFill />,
  //   iconOpened: <RiIcons.RiArrowUpSFill />,

  //   subNav: [
  //     {
  //       title: 'Users',
  //       path: '/General/users',
  //       icon: <IoIcons.IoIosPerson />
  //     },
  //     {
  //       title: 'Messages',
  //       path: '/General/messages',
  //       icon: <FaIcons.FaEnvelopeOpenText />
  //     },
  //     {
  //       title: 'Menus',
  //       path: '/General/menus',
  //       icon: <AiIcons.AiOutlineMenuUnfold />
  //     }
  //   ]
  // },
  // {
  //   title: 'Production',
  //   path: '/Production',
  //   icon: <FaIcons.FaWaveSquare />,
  //   iconClosed: <RiIcons.RiArrowDownSFill />,
  //   iconOpened: <RiIcons.RiArrowUpSFill />,

  //   subNav: [
  //     {
  //       title: 'Job Jacket',
  //       path: '/Production/job-jacket',
  //       icon: <IoIcons.IoMdPaper/>
  //     },
  //     {
  //       title: 'PO/CA',
  //       path: '/Production/poca',
  //       icon: <IoIcons.IoMdPaper />
  //     },
  //     {
  //       title: 'Job cost',
  //       path: '/Production/job-cost',
  //       icon: <FaIcons.FaMoneyBillWave />
  //     },
  //     {
  //       title: 'Quote',
  //       path: '/Production/quote',
  //       icon: <IoIcons.IoLogoUsd />
  //     },
  //     {
  //       title: 'Standard',
  //       path: '/Production/standard',
  //       icon: <IoIcons.IoMdPaper />
  //     }
  //   ]
  // },
  // {
  //   title: 'Jobs',
  //   path: '/Jobs',
  //   icon: <IoIcons.IoIosBriefcase />,
  //   iconClosed: <RiIcons.RiArrowDownSFill />,
  //   iconOpened: <RiIcons.RiArrowUpSFill />,

  //   subNav: [
  //     {
  //       title: 'File Maintenance',
  //       path: '/Jobs/fileMaintenance',
  //       icon: <IoIcons.IoIosFiling />,
  //       cName: 'sub-nav'
  //     },
  //     {
  //       title: 'Job Changes',
  //       path: '/Jobs/changes',
  //       icon: <IoIcons.IoIosClipboard />,
  //       cName: 'sub-nav'
  //     },
  //     {
  //       title: 'Clear Job Locks',
  //       path: '/Jobs/clearLocks',
  //       icon: <IoIcons.IoMdUnlock />
  //     },
  //     {
  //       title: 'Check Job Time',
  //       path: '/Jobs/clearJobTime',
  //       icon: <IoIcons.IoMdStopwatch />
  //     },
  //     {
  //       title: 'Make Job Visible',
  //       path: '/Jobs/makeVisible',
  //       icon: <IoIcons.IoIosColorWand />
  //     },
  //     {
  //       title: 'Job Reports',
  //       path: '/Jobs/jobReports',
  //       icon: <IoIcons.IoIosFolder />
  //     }
  //   ]
  // },
  // {
  //   title: 'Shipping',
  //   path: '/Shipping',
  //   icon: <FaIcons.FaShippingFast />
  // },
  // {
  //   title: 'Time',
  //   path: '/Time',
  //   icon: <FaIcons.FaHourglassHalf />,
  //   iconClosed: <RiIcons.RiArrowDownSFill />,
  //   iconOpened: <RiIcons.RiArrowUpSFill />,

  //   subNav: [
  //     {
  //       title: 'Time Clock',
  //       path: '/Time/clock',
  //       icon: <IoIcons.IoIosTime />
  //     },
  //     {
  //       title: 'Time Clock Reports',
  //       path: '/Time/clockReports',
  //       icon: <IoIcons.IoIosToday />
  //     },
  //     {
  //       title: 'Record Maintenance',
  //       path: '/Time/recordMaintain',
  //       icon: <IoIcons.IoIosConstruct />
  //     },
  //     {
  //       title: 'Sick & Vacation',
  //       path: '/Time/sickVacation',
  //       icon: <IoIcons.IoIosCalendar />
  //     }
  //   ]
  // },
  // {
  //   title: 'Roll Paper',
  //   path: '/Paper',
  //   icon: <IoIcons.IoIosPaper />
  // },
  // {
  //   title: 'Invoice',
  //   path: '/Invoice',
  //   icon: <FaIcons.FaFileInvoiceDollar />
  // },
  {
    title: 'Inventory',
    path: '/Inventory',
    icon: <FaIcons.FaDollyFlatbed />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedLevels: ['Production', 'Information Technology', 'Executive'],

    subNav: [
      {
        title: 'Sheet Material',
        path: '/Inventory/SMI',
        icon: <IoIcons.IoIosPaper />
      },
      // {
      //   title: 'FGI',
      //   path: '/Inventory/fgi',
      //   icon: <IoIcons.IoMdToday />
      // },
      // {
      //   title: 'IGI',
      //   path: '/Inventory/igi',
      //   icon: <IoIcons.IoMdToday />
      // },
      // {
      //   title: 'PGI',
      //   path: '/Inventory/pgi',
      //   icon: <IoIcons.IoMdToday />
      // },
      // {
      //   title: 'PI',
      //   path: '/Inventory/pi',
      //   icon: <IoIcons.IoMdToday />
      // },
      // {
      //   title: 'Transfer FGI/IGI to PGI',
      //   path: '/Inventory/transfer',
      //   icon: <IoIcons.IoMdToday />
      // },
      // {
      //   title: 'Inventory Reports',
      //   path: '/Inventory/reports',
      //   icon: <IoIcons.IoMdToday />
      // },
      // {
      //   title: 'Location Maintenance',
      //   path: '/Inventory/maintenance',
      //   icon: <IoIcons.IoMdToday />
      // }
    ]
  },
  // {
  //   title: 'OSP',
  //   path: '/OSP',
  //   icon: <FaIcons.FaClipboardCheck />,
  //   iconClosed: <RiIcons.RiArrowDownSFill />,
  //   iconOpened: <RiIcons.RiArrowUpSFill />,

  //   subNav: [
  //     {
  //       title: 'A/P Invoices',
  //       path: '/OSP/ap-invoices',
  //       icon: <IoIcons.IoMdToday />
  //     },
  //     {
  //       title: 'Freight Invoices',
  //       path: '/OSP/freight-invoices',
  //       icon: <IoIcons.IoMdToday />
  //     },
  //     {
  //       title: 'Vendor Invoices',
  //       path: '/OSP/vendor-invoices',
  //       icon: <IoIcons.IoMdToday />
  //     },
  //     {
  //       title: 'Vendor GL Defaults',
  //       path: '/OSP/vendor-defaults',
  //       icon: <IoIcons.IoMdToday />
  //     },
  //     {
  //       title: 'Entry',
  //       path: '/OSP/entry',
  //       icon: <IoIcons.IoMdToday />
  //     },
  //     {
  //       title: 'Edit List',
  //       path: '/OSP/edit-list',
  //       icon: <IoIcons.IoMdToday />
  //     },
  //     {
  //       title: 'Post',
  //       path: '/OSP/post',
  //       icon: <IoIcons.IoMdToday />
  //     },
  //     {
  //       title: 'Fix Posted Entries',
  //       path: '/OSP/fix-entries',
  //       icon: <IoIcons.IoMdToday />
  //     },
  //     {
  //       title: 'Report',
  //       path: '/OSP/report',
  //       icon: <IoIcons.IoMdToday />
  //     }
  //   ]
  // },
  {
    title: 'Job Performance',
    path: '/JobPerformance',
    icon: <FaIcons.FaClipboardCheck />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    allowedLevels: ['Customer Service', 'Sales', 'Information Technology', 'Executive'],

    subNav: [
      {
        title: 'Client Surveys',
        path: '/JobPerformance/Surveys',
        icon: <IoIcons.IoMdToday />
      },
    ]
  },
  {
    title: 'Team',
    path: '/Team',
    icon: <IoIcons.IoMdPeople />,
    allowedLevels: ['Information Technology', 'Executive'],
  },
  {
    title: 'Support',
    path: '/Support',
    icon: <IoIcons.IoMdHelpCircle />,
    allowedLevels: ['Production', 'Customer Service', 'Sales', 'Information Technology', 'Executive'],
  }
];